const response = (status, msg, data, res) => {
  res.status(status).json({
    statuscode: status,
    message: msg,
    data: data,
  });
};

module.exports = response;
