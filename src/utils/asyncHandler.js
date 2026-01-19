const asynHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}



export { asyncHandler};

// This method can also be used :

// const asyncHandler = () => {} Normal way to create asyn function
//const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {} function ke andar asyn function    
//const asyncHandler = (fn) => async (req,res,next) => {
//    try{
//        await fn(req, res, next)
//    } catch (error) {
//        res.status(error.code || 500).json({
//            success: false,
//            message: error.message
//        })
//    }
//}