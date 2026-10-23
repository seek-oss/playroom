import * as assistant from '__PLAYROOM_ALIAS__ASSISTANT_CLIENT__';
import { OpenAI } from 'openai/client';

export const assistantEnabled = assistant.client instanceof OpenAI;

export const client = assistant.client;

export const model = assistant.model;
