import Message from "../models/Message.js";
import User from "../models/User.js";

const publicUserFields = "name username avatar role verified";

const normalizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  avatar: user.avatar,
  role: user.role,
  verified: user.verified,
});

const normalizeMessage = (message) => ({
  id: message._id,
  senderId: message.sender._id ? message.sender._id.toString() : message.sender.toString(),
  recipientId: message.recipient._id
    ? message.recipient._id.toString()
    : message.recipient.toString(),
  content: message.content,
  createdAt: message.createdAt,
  seen: message.seen,
});

const canMessageUser = (currentUser, targetUserId) =>
  currentUser.following.some((id) => id.toString() === targetUserId.toString());

export const getConversations = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id).populate("following", publicUserFields);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedUsers = currentUser.following || [];
    const followedIds = followedUsers.map((user) => user._id);

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: { $in: followedIds } },
        { recipient: req.user._id, sender: { $in: followedIds } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("sender", publicUserFields)
      .populate("recipient", publicUserFields);

    const conversationMap = new Map();

    followedUsers.forEach((followedUser) => {
      conversationMap.set(followedUser._id.toString(), {
        id: followedUser._id.toString(),
        participant: normalizeUser(followedUser),
        lastMessage: "",
        lastMessageTime: null,
        unread: 0,
        messages: [],
      });
    });

    messages.forEach((message) => {
      const senderId = message.sender._id.toString();
      const recipientId = message.recipient._id.toString();
      const participant =
        senderId === req.user._id.toString() ? message.recipient : message.sender;
      const participantId = participant._id.toString();

      if (!conversationMap.has(participantId)) {
        conversationMap.set(participantId, {
          id: participantId,
          participant: normalizeUser(participant),
          lastMessage: "",
          lastMessageTime: null,
          unread: 0,
          messages: [],
        });
      }

      const conversation = conversationMap.get(participantId);

      if (!conversation.lastMessageTime) {
        conversation.lastMessage = message.content;
        conversation.lastMessageTime = message.createdAt;
      }

      if (recipientId === req.user._id.toString() && !message.seen) {
        conversation.unread += 1;
      }
    });

    const conversations = Array.from(conversationMap.values()).sort((a, b) => {
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      }

      if (a.lastMessageTime) return -1;
      if (b.lastMessageTime) return 1;

      return a.participant.name.localeCompare(b.participant.name);
    });

    res.status(200).json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;

    if (!canMessageUser(req.user, targetUserId)) {
      return res.status(403).json({ message: "You can only message users you follow" });
    }

    const targetUser = await User.findById(targetUserId).select(publicUserFields);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Message.updateMany(
      {
        sender: targetUserId,
        recipient: req.user._id,
        seen: false,
      },
      { $set: { seen: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: targetUserId },
        { sender: targetUserId, recipient: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", publicUserFields)
      .populate("recipient", publicUserFields);

    res.status(200).json({
      success: true,
      participant: normalizeUser(targetUser),
      messages: messages.map(normalizeMessage),
    });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    if (!canMessageUser(req.user, targetUserId)) {
      return res.status(403).json({ message: "You can only message users you follow" });
    }

    const targetUser = await User.findById(targetUserId).select(publicUserFields);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: targetUserId,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", publicUserFields)
      .populate("recipient", publicUserFields);

    res.status(201).json({
      success: true,
      message: normalizeMessage(populatedMessage),
      participant: normalizeUser(targetUser),
    });
  } catch (err) {
    next(err);
  }
};
