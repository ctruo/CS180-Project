module.exports = () => {
  if (process.env.BACKUP_NODE_ENV) {
    process.env.NODE_ENV = process.env.BACKUP_NODE_ENV;
  } else {
    process.env.NODE_ENV = "development";
  }

  if (global.createJSDOM) {
    delete global.createJSDOM;
  }
};
