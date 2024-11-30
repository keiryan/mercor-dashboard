import { cache } from 'react';

export interface TaskRecord {
  id: string;
  createdTime: string;
  fields: {
    '[1] Task Id': number;
    'Prompt': string;
    'Prompt Website': string;
    'Prompt Category': string;
    '[1] Attempt Status': string;
    '[1] Assigned To'?: {
      id: string;
      email: string;
      name: string;
    };
    'Handling Time in Minutes': number | { specialValue: string };
    'Last Modified': string;
  };
}

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableId: string;
}

interface AirtableResponse {
  records: TaskRecord[];
  offset?: string;
}

async function fetchPage(config: AirtableConfig, offset?: string): Promise<AirtableResponse> {
  const params = new URLSearchParams();
  if (offset) {
    params.append('offset', offset);
  }
  params.append('pageSize', '100');

  const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableId}?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error('Pagination session expired. Retrying from the beginning.');
    }
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  return response.json();
}

export const fetchTasks = cache(async function fetchTasks(config: AirtableConfig): Promise<TaskRecord[]> {
  const allRecords: TaskRecord[] = [];
  let offset: string | undefined;
  let retryCount = 0;
  const MAX_RETRIES = 3;

  try {
    do {
      try {
        const response = await fetchPage(config, offset);
        allRecords.push(...response.records);
        offset = response.offset;
      } catch (error) {
        if (retryCount >= MAX_RETRIES) {
          throw error;
        }
        if (error instanceof Error && error.message.includes('Pagination session expired')) {
          console.warn('Pagination session expired, retrying from the beginning...');
          retryCount++;
          offset = undefined;
          continue;
        }
        throw error;
      }
    } while (offset);

    return allRecords;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
});