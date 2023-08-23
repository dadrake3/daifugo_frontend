import { AUTH_TYPE } from "aws-appsync-auth-link";

type AppSyncConfig = {
    aws_appsync_graphqlEndpoint: string,
    aws_appsync_region: string,
    aws_appsync_authenticationType: AUTH_TYPE.API_KEY,
    aws_appsync_apiKey: string
}

const appSyncConfig: AppSyncConfig =  {
    "aws_appsync_graphqlEndpoint": "https://v2hlavkz65g7hmpnk7sokb6yiq.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "API_KEY" as AUTH_TYPE.API_KEY,
    "aws_appsync_apiKey": "da2-ryktoshmmjcc7nichj53rmw2im",
};

export default appSyncConfig;