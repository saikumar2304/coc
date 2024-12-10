const cooldowns = new Map();

export const handleCooldown = (userId, commandName, cooldownTime) => {
  const key = `${userId}-${commandName}`;
  const now = Date.now();
  
  if (cooldowns.has(key)) {
    const expirationTime = cooldowns.get(key) + cooldownTime;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return `Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`;
    }
  }
  
  cooldowns.set(key, now);
  return null;
};