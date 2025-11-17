import { jsPDF } from "jspdf";
import { Location, TransportState } from "./types";
import { formatTravelTime } from "./timeDistance";

/** Загружаем ttf-шрифт и добавляем в PDF */
async function loadAndEmbedFont(pdf: jsPDF) {
  try {
    const res = await fetch("/fonts/NotoSansJP-Regular.ttf");
    if (!res.ok) throw new Error("Font not found");

    const ab = await res.arrayBuffer();
    const bytes = new Uint8Array(ab);

    const base64 = btoa(
      bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
    );

    const fontFile = "NotoSansJP-Regular.ttf";

    pdf.addFileToVFS(fontFile, base64);
    pdf.addFont(fontFile, "NotoSansJP", "normal");
    pdf.setFont("NotoSansJP");
  } catch (e) {
    console.warn("Failed to embed Japanese font:", e);
  }
}

/** Загружаем картинку по URL → DataURL */
async function imageUrlToDataUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error("Image fetch failed");

    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Image load failed for", url, e);
    return "/placeholder.jpg";
  }
}

function wrap(pdf: jsPDF, text: string, max: number) {
  return pdf.splitTextToSize(text || "", max);
}

/** 🟡 Главная функция экспорта PDF */
export async function createPdf(
  selected: Location[],
  startingPoint: string,
  startTime: string,
  transport: TransportState
) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 14;

  let y = 18;

  // Подключаем шрифт
  await loadAndEmbedFont(pdf);

  // Верхний блок
  pdf.setFillColor("#f9d853");
  pdf.rect(0, 0, pageW, 40, "F");

  const logoWidth = 80;
  const logoHeight = 17;

  const yPos = 12;

  const logoUrl = "/logo4.png";
  const logoDataUrl = await imageUrlToDataUrl(logoUrl); // твоя функция для преобразования

  pdf.addImage(
    logoDataUrl,
    "PNG",
    margin,
    yPos - logoHeight / 2,
    logoWidth,
    logoHeight
  );

  pdf.setFontSize(10);
  pdf.setTextColor("#3e2723");
  pdf.text(`Created: ${new Date().toLocaleString()}`, margin, 26);

  y += 10;

  pdf.setFontSize(11);
  pdf.setTextColor("#3e2723");

  pdf.setDrawColor("#ffffff");
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageW - margin, y);
  y += 6;

  // ——— Итоги времени ———
  let totalTravel = 0;
  let totalVisit = 0;

  selected.forEach((s) => {
    totalTravel += s.travelMins ?? 0;
    totalVisit += s.visitTime ?? 0;
  });

  const total = totalTravel + totalVisit;

  const leftInfo = `Start: ${startingPoint || "—"} · ${
    startTime || "—"
  } · Travel by ${
    transport === "car" ? "car" : transport === "public" ? "bus" : "—"
  }`;

  const rightInfo = `Total time: ${formatTravelTime(total)} (${formatTravelTime(
    totalTravel
  )} travel + ${formatTravelTime(totalVisit)} visit)`;

  pdf.setFontSize(11);
  pdf.text(leftInfo, margin, y);
  pdf.text(rightInfo, pageW - margin, y, { align: "right" });

  y += 3;
  pdf.line(margin, y, pageW - margin, y);
  y += 12;

  // ——— Список локаций ———
  if (selected.length === 0) {
    pdf.setFontSize(12);
    pdf.text("No locations selected", margin, y);
  } else {
    for (let i = 0; i < selected.length; i++) {
      const loc = selected[i];

      const bottomLimit = pageH - 10;
      const imgH = 40;
      const imgW = 60;

      // новая страница при нехватке места
      if (y + imgH + 20 > bottomLimit) {
        pdf.addPage();
        y = margin;
      }

      // картинка
      let imgData: string | null = null;
      if (loc.image) imgData = await imageUrlToDataUrl(loc.image);

      if (imgData) {
        pdf.addImage(imgData, "JPEG", margin, y, imgW, imgH);
      } else {
        pdf.setDrawColor("#e0d6c2");
        pdf.rect(margin, y, imgW, imgH);
      }

      // текст рядом
      const textX = margin + imgW + 6;
      let textY = y + 6;

      pdf.setFontSize(12);
      pdf.setTextColor("#3e2723");
      pdf.text(`${i + 1}. ${loc.name}`, textX, textY);
      textY += 6;

      pdf.setFontSize(9);
      pdf.setTextColor("#6d4c41");

      const lines = wrap(pdf, loc.desc, pageW - textX - margin);
      pdf.text(lines, textX, textY);
      textY += lines.length * 5 + 4;

      // доп. инфо
      pdf.setTextColor("#3e2723");
      const meta = [];

      if (loc.arrivalTime && loc.endTime)
        meta.push(`${loc.arrivalTime}–${loc.endTime}`);

      if (loc.travelMins !== undefined)
        meta.push(`Travel: ${formatTravelTime(loc.travelMins)}`);

      if (loc.distanceKm !== undefined)
        meta.push(`${loc.distanceKm.toFixed(1)} km`);

      if (meta.length > 0) {
        pdf.text(meta.join(" · "), textX, textY);
        textY += 6;
      }

      y += Math.max(imgH, textY - y) + 8;

      pdf.setDrawColor("#f0e7df");
      pdf.line(margin, y, pageW - margin, y);
      y += 6;
    }
  }

  // нижняя лента
  pdf.setFillColor("#e74c3c");
  pdf.rect(0, pageH - 10, pageW, 10, "F");
  pdf.setTextColor("#fff");
  pdf.setFontSize(10);
  pdf.text("TravelQuest — Happy travels!", pageW / 2, pageH - 5, {
    align: "center",
    baseline: "middle",
  });

  // вывод PDF
  try {
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (e) {
    console.error("PDF open failed", e);
    pdf.save("route.pdf");
  }
}
