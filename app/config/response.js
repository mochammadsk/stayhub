module.exports = {
  commonError: {
    error: true,
    messages: "An error occurred on the server",
  },

  commonErrorMsg: (messages) => {
    return {
      error: true,
      messages: messages,
    };
  },

  commonSuccess: {
    error: false,
    messages: "Successfully loaded request",
  },

  commonSuccessMsg: (messages) => {
    return {
      error: false,
      messages: messages,
    };
  },

  commonResult: (data) => {
    return {
      error: false,
      messages: "Successfully loaded data",
      data: data,
    };
  },
};
