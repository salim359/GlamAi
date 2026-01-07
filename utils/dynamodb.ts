import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({});

export async function saveLook(item: any) {
  await db.send(
    new PutItemCommand({
      TableName: process.env.TABLE!,
      Item: Object.entries(item).reduce((acc, [k, v]) => ({ ...acc, [k]: { S: JSON.stringify(v) } }), {}),
    })
  );
}

export async function getLooks(userId: string) {
  const res = await db.send(
    new QueryCommand({
      TableName: process.env.TABLE!,
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": { S: userId } },
    })
  );
  return res.Items?.map(item => JSON.parse(item.uploadId.S!)) || [];
}
