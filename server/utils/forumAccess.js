export const calculateMatch = (userSkills = [], forumSkills = []) => {
  if (!forumSkills.length) {
    return 0;
  }

  const normalizedUserSkills = new Set(
    userSkills.map((skill) => skill.trim().toLowerCase())
  );

  const matchedSkills = forumSkills.filter((skill) =>
    normalizedUserSkills.has(skill.trim().toLowerCase())
  );

  return Math.round((matchedSkills.length / forumSkills.length) * 100);
};

export const getMissingSkills = (userSkills = [], forumSkills = []) => {
  const normalizedUserSkills = new Set(
    userSkills.map((skill) => skill.trim().toLowerCase())
  );

  return forumSkills.filter(
    (skill) => !normalizedUserSkills.has(skill.trim().toLowerCase())
  );
};

export const getAccessLevel = (matchPercent) => {
  if (matchPercent > 70) {
    return {
      level: "post",
      canComment: true,
      canPost: true,
    };
  }

  if (matchPercent >= 40) {
    return {
      level: "comment",
      canComment: true,
      canPost: false,
    };
  }

  return {
    level: "view",
    canComment: false,
    canPost: false,
  };
};
