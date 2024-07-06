function calculateAge(dobString) {
  const dob = new Date(dobString);
  const ageDiff = new Date(Date.now() - dob.getTime());
  return Math.abs(ageDiff.getUTCFullYear() - 1970);
}

module.exports = { calculateAge };
