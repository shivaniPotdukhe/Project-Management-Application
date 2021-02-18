exports.notFoundResponse = function (res, msg) {
    let data = {
      message: msg,
    };
    return res.status(404).json(data);
  };

exports.ErrorResponse = function (res, msg) {
    let data = {
        message: msg,
    };
    return res.status(500).json(data);
};

exports.successResponseWithData = function (res, data, meta) {
    let resData = {
      data: data,
    };
    if (meta) resData.meta = meta;
    return res.status(200).json(resData);
  };

  exports.successResponse = function (res, msg) {
    let data = {
      status: 1,
      message: msg,
    };
    return res.status(200).json(data);
  };
