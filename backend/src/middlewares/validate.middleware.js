export const validate = (validatorFunc, source = 'body') => {
  return (req, res, next) => {
    try {
      if (source === 'body') {
        validatorFunc(req.body);
      } else if (source === 'params') {
        validatorFunc(req.params);
      } else if (source === 'query') {
        validatorFunc(req.query);
      } else {
        validatorFunc(req);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
