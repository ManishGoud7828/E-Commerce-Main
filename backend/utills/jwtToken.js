// create and send token and save in the cookie
const sendToken = (user, statusCode, res) => {
    // create jwt token
    const token = user.getJwtToken();

    // optons for cookie
    const options = {
        // if not httpOnly then token be access through JS 
        // token expires after 7 days
        expires: new Date(Date.now + process.env.COOKIE_EXPIRES_TIME * 60 * 60 * 1000),
        httpOnly: true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}
module.exports = sendToken;