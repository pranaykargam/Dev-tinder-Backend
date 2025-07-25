# DevTinder APIs

## authRouter
- post/signup
- post/login
- post/logout

## profileRouter
- get/profile/view
- patch/profile/edit
- patch/profile/password // forgot password API

## RequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/rejected/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user /feed - Gets you the profiles of other users on platform

status: ignore, intrested,accepted, rejected