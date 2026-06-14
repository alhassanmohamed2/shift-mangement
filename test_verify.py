import passlib.context
pwd_context = passlib.context.CryptContext(schemes=["bcrypt"], deprecated="auto")
print(pwd_context.verify("admin", "$2b$12$I9hyyW7h2LjvONpEBxOMb.3aTyOAA.4dITw5ygtsSc9ZToHY81jjK"))
