# **One Piece API Rate General Document**

- One Piece Gateway is the entrypoint for all services.

## **One Piece API Rate Limits**

- Service Evaluate API Rate Limits are tracked on an individual applicaiton, depending on type of `IP Address` used in the request.

### **Applications**

- API Requests made with an `IP Address` are counted against that app's rate limit. An app's call count is the number of calls it can make during a rolling one minutes window and is calculated as follows:

```
    Calls with one minutes = 100 * Number of Application
```
