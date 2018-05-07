## loopback-swagger paramaters.schema.description fix

loopback-swagger/lib/specgen/route-helper.js line 314

if (paramObject.schema.description) delete paramObject.schema.description

NOT Working


## Way to fix swagger for WSO2
lb export-api-def --json -o devfiles/core-swagger-raw.json
cd devfiles
node lbswaggerfix.js