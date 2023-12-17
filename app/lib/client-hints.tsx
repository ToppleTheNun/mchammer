import { getHintUtils } from "@epic-web/client-hints";
import { subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme";
import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";

import { useRequestInfo } from "./request-info.ts";

const hintsUtils = getHintUtils({
  // add other hints here
});

export const { getHints } = hintsUtils;

export function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}

export function ClientHintCheck({ nonce }: { nonce: string }) {
  const { revalidate } = useRevalidator();
  useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate]);

  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  );
}
