const passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
jwtOptions.secretOrKey = process.env.SESSION_SECRET;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {

    if (jwt_payload) {

        next(null, {

            _id: jwt_payload._id,
            username: jwt_payload.username
        });
    }
    else {

        next(null, false);
    }
})

module.exports.getStrategy= function(){

    return strategy;
}

module.exports.jwtOptions = function(){

    return jwtOptions;
}