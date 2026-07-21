"use client";

import axios, { isAxiosError } from "axios";
import { useState } from "react";

import type { SearchRequest } from "@/schemas/agent/search-request-schema";
import {
  searchApiResponseSchema,
  type SearchResultData,
} from "@/schemas/agent/search-response-schema";

const searchApiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export function useSearch() {
  const [result, setResult] =
    useState<SearchResultData | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function submitSearch(
    request: SearchRequest,
  ): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await searchApiClient.post(
        "/search",
        request,
      );

      const parsedResponse =
        searchApiResponseSchema.safeParse(
          response.data,
        );

      if (!parsedResponse.success) {
        throw new Error(
          "JobClaw returned an invalid API response.",
        );
      }

      if (!parsedResponse.data.success) {
        setErrorMessage(
          parsedResponse.data.error.message,
        );
        return;
      }

      setResult(parsedResponse.data.data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const parsedErrorResponse =
          searchApiResponseSchema.safeParse(
            error.response?.data,
          );

        if (
          parsedErrorResponse.success &&
          !parsedErrorResponse.data.success
        ) {
          setErrorMessage(
            parsedErrorResponse.data.error.message,
          );
          return;
        }

        if (error.code === "ECONNABORTED") {
          setErrorMessage(
            "The search request timed out.",
          );
          return;
        }

        if (!error.response) {
          setErrorMessage(
            "Could not connect to the JobClaw API.",
          );
          return;
        }
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    result,
    errorMessage,
    isSubmitting,
    submitSearch,
  };
}