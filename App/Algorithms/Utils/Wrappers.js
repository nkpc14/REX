import {validationResult} from 'express-validator';

export const HttpResponseHandler = (req,res, response) => {
    if (response.success) {
        console.log("Success");
        return res.json(response.data);
    } else {
       return  res.json(response);
    }
};

export const isValidRequest = (req) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json(result);
    }
};

export const HttpSuccessResponse = (data = null, message = null, statusCode = 200) => {
    return {
        success: true,
        message: message,
        data: data,
        statusCode: statusCode
    }
};

export const HttpRejectResponse = (message, statusCode) => {
    return {
        success: false,
        message: message,
        data: null,
        statusCode: statusCode
    }
};