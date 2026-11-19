"use client";

import { useEffect, useState } from "react";
import jikguMascot from "../../../mascot/직구 대리.png";

/* 프로젝트 최상위 mascot 폴더의 이미지를 직접 불러오므로 public 폴더로 복사할 필요가 없습니다. */
const MASCOT_SRC = jikguMascot.src;

/* 인터넷이 끊겨도 마스코트가 보이도록, 연결되어 있을 때 미리 받아 메모리에 보관합니다. */
let cachedMascotUrl: string | null = null;
let mascotRequest: Promise<string | null> | null = null;

function preloadMascot() {
  if (cachedMascotUrl) return Promise.resolve(cachedMascotUrl);
  if (!mascotRequest) {
    mascotRequest = fetch(MASCOT_SRC)
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (blob) cachedMascotUrl = URL.createObjectURL(blob);
        return cachedMascotUrl;
      })
      .catch(() => {
        mascotRequest = null;
        return null;
      });
  }
  return mascotRequest;
}

/* 전체 화면 로딩 화면: 흰 배경, 가운데에 마스코트와 안내 문구 */
export function LoadingScreen() {
  const [mascotUrl, setMascotUrl] = useState<string | null>(cachedMascotUrl);

  useEffect(() => {
    let active = true;
    preloadMascot().then((url) => {
      if (active && url) setMascotUrl(url);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <span
        className="loading-mascot"
        role="img"
        aria-label="버드가드 마스코트"
        style={{ backgroundImage: `url("${mascotUrl ?? MASCOT_SRC}")` }}
      />
      <p>잠시만 기다려주세요...</p>
    </div>
  );
}

/* 인터넷 연결이 끊긴 동안 로딩 화면을 덮어 보여줍니다. 연결되면 자동으로 사라집니다. */
export function OfflineLoadingScreen() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    preloadMascot();

    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return offline ? <LoadingScreen /> : null;
}
