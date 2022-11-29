class AppError extends Error{
    constructor(msg,status){
        super();
        this.status = status;
        this.message = msg;
    }
}

module.exports = AppError;