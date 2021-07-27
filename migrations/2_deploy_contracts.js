const ProjectHub = artifacts.require("ProjectHub");
const Project = artifacts.require('Project');

module.exports = function(deployer) {
  deployer.deploy(Project);
  deployer.deploy(ProjectHub);
};
