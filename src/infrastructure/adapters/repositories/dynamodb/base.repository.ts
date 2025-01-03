import { 
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '../../../../config/aws';

export abstract class DynamoDBRepository<T> {
  constructor(protected readonly tableName: string) {}

  protected async create(item: T): Promise<T> {
    await dynamoDb.send(new PutCommand({
      TableName: this.tableName,
      Item: item
    }));
    return item;
  }

  protected async findById(id: string): Promise<T | null> {
    const result = await dynamoDb.send(new GetCommand({
      TableName: this.tableName,
      Key: { id }
    }));
    return result.Item as T || null;
  }

  protected async update(id: string, updates: Partial<T>): Promise<T | null> {
    const updateExpression = Object.keys(updates)
      .map(key => `#${key} = :${key}`)
      .join(', ');

    const expressionAttributeNames = Object.keys(updates)
      .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});

    const expressionAttributeValues = Object.entries(updates)
      .reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {});

    const result = await dynamoDb.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));

    return result.Attributes as T || null;
  }

  protected async delete(id: string): Promise<boolean> {
    await dynamoDb.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { id }
    }));
    return true;
  }

  protected async query(keyCondition: string, expressionValues: Record<string, any>): Promise<T[]> {
    const result = await dynamoDb.send(new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionValues
    }));
    return result.Items as T[] || [];
  }
}