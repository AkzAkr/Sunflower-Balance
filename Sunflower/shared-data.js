// shared-data.js - VERSI FINAL DENGAN UTC PARSING

(function (global) {
  "use strict";

  const STORAGE_KEY = "sunflower_csv_data";
  const METADATA_KEY = "sunflower_csv_metadata";

  // State internal
  let _data = [];
  let _isRealData = false;
  let _sourceFile = "Data Demo";
  let _lastUpdated = null;

  // ==========================================
  // UTILITY: Cek apakah string adalah header
  // ==========================================
  function isHeaderRow(row) {
    const dateVal = String(
      row.date || row["Mo/Day/Yr"] || row["Date"] || row["Tanggal"] || "",
    )
      .trim()
      .toLowerCase();

    const headerPatterns = [
      "mo/day/yr",
      "day",
      "date",
      "tanggal",
      "mo",
      "yr",
      "month",
      "year",
    ];

    return headerPatterns.some((pattern) => dateVal.includes(pattern));
  }

  // ==========================================
  // UTILITY: Parse tanggal MM/DD/YYYY dengan UTC
  // ==========================================
  function parseDate(dateVal) {
    if (!dateVal || typeof dateVal !== "string") return null;

    const str = dateVal.trim();

    // Skip header text
    const lowerStr = str.toLowerCase();
    if (
      lowerStr.includes("mo/day/yr") ||
      (lowerStr.includes("day") && lowerStr.includes("yr")) ||
      lowerStr === "date" ||
      lowerStr === "tanggal" ||
      lowerStr === "mo" ||
      lowerStr === "day" ||
      lowerStr === "yr"
    ) {
      return null;
    }

    // Format MM/DD/YYYY
    const parts = str.split("/");
    if (parts.length === 3) {
      let month = parseInt(parts[0]); // 1-12
      let day = parseInt(parts[1]); // 1-31
      let year = parseInt(parts[2]); // 2 atau 4 digit

      // Validasi
      if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
      if (month < 1 || month > 12 || day < 1 || day > 31) return null;

      // Fix 2-digit year
      if (year < 50) year += 2000;
      else if (year < 100) year += 1900;

      // BUAT TANGGAL DENGAN UTC agar tidak ada offset timezone
      const date = new Date(Date.UTC(year, month - 1, day));

      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    return null;
  }

  // ==========================================
  // UTILITY: Parse angka dengan aman
  // ==========================================
  function parseNumber(val) {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : val;

    // Bersihkan string: hapus spasi, ganti koma dengan titik
    const cleaned = String(val).trim().replace(/,/g, ".");
    const num = parseFloat(cleaned);

    return isNaN(num) ? 0 : num;
  }

  // ==========================================
  // UTILITY: Format tanggal ke YYYY-MM-DD (UTC)
  // ==========================================
  function formatDateUTC(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // ==========================================
  // UTILITY: Deteksi dan mapping field CSV
  // ==========================================
  function detectAndMapFields(rawData) {
    if (!rawData || rawData.length === 0) return [];

    console.log("Raw headers:", Object.keys(rawData[0]));
    console.log("First 3 raw rows:", rawData.slice(0, 3));

    const processed = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];

      // Skip header row dengan berbagai cara deteksi
      if (i === 0 && isHeaderRow(row)) {
        console.log(`Skipping header row at index ${i}`);
        continue;
      }

      // Ambil semua values dari row
      const keys = Object.keys(row);
      const values = keys.map((k) => row[k]);

      // Cari field tanggal
      let dateVal = null;

      // Coba cari field dengan nama date/tanggal
      for (const key of keys) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes("day") ||
          lowerKey.includes("date") ||
          lowerKey.includes("tanggal") ||
          lowerKey.includes("time") ||
          lowerKey.includes("mo/")
        ) {
          dateVal = row[key];
          break;
        }
      }

      // Fallback: field pertama
      if (!dateVal && values.length > 0) {
        dateVal = values[0];
      }

      // Parse tanggal
      const parsedDate = parseDate(dateVal);

      if (!parsedDate) {
        console.log(`Row ${i}: Invalid date "${dateVal}", skipping`);
        continue; // Skip baris ini
      }

      // Mapping field berdasarkan posisi
      const mapped = {
        date: formatDateUTC(parsedDate),
        precipitation: parseNumber(values[1]),
        irrigation: parseNumber(values[2]),
        water_use: parseNumber(values[3]),
        soil_water_deficit: parseNumber(values[4]),
        water_stress_coefficient: Math.max(
          0,
          Math.min(1, parseNumber(values[5] || 1)),
        ),
        growth_stage: String(values[6] || "Tidak diketahui").trim(),
      };

      processed.push(mapped);
    }

    console.log("Processed:", processed.length, "valid rows");
    console.log("First processed:", processed[0]);
    console.log("Last processed:", processed[processed.length - 1]);

    return processed;
  }

  // Generate data demo
  function generateMockData() {
    const data = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayOfYear = 90 - i;
      let growthStage;
      if (dayOfYear < 20) growthStage = "Vegetatif Awal";
      else if (dayOfYear < 40) growthStage = "Vegetatif Akhir";
      else if (dayOfYear < 60) growthStage = "Berkembang";
      else if (dayOfYear < 80) growthStage = "Reproduktif";
      else growthStage = "Pengisian";

      const baseWater = 3.5 + dayOfYear * 0.02;
      const precipitation =
        Math.random() > 0.7 ? Math.random() * 25 : Math.random() * 3;
      const irrigation = Math.max(0, baseWater * 0.6 + (Math.random() * 2 - 1));
      const waterUse = baseWater + (Math.random() * 1 - 0.5);
      const soilWaterDeficit = Math.max(
        0,
        (waterUse - precipitation - irrigation) * 0.8,
      );
      const ks = Math.max(0.3, Math.min(1.0, 1.0 - soilWaterDeficit / 10));

      data.push({
        date: formatDateUTC(date),
        precipitation: parseFloat(precipitation.toFixed(2)),
        irrigation: parseFloat(irrigation.toFixed(2)),
        water_use: parseFloat(waterUse.toFixed(2)),
        soil_water_deficit: parseFloat(soilWaterDeficit.toFixed(2)),
        water_stress_coefficient: parseFloat(ks.toFixed(2)),
        growth_stage: growthStage,
      });
    }
    return data;
  }

  // Load dari localStorage
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const meta = localStorage.getItem(METADATA_KEY);

      if (stored) {
        _data = JSON.parse(stored);
        _isRealData = true;

        if (meta) {
          const metadata = JSON.parse(meta);
          _lastUpdated = metadata.lastUpdated;
          _sourceFile = metadata.sourceFile || "Data CSV";
        }
        console.log("🌻 Loaded from storage:", _data.length, "rows");
        console.log(
          "📅 Date range:",
          _data[0]?.date,
          "to",
          _data[_data.length - 1]?.date,
        );
        return true;
      }
    } catch (e) {
      console.error("Error loading from storage:", e);
    }
    return false;
  }

  // Public API
  const SunflowerData = {
    // Inisialisasi - WAJIB dipanggil pertama kali
    init: function () {
      if (!loadFromStorage()) {
        _data = generateMockData();
        _isRealData = false;
        _sourceFile = "Data Demo";
        console.log("🌻 Generated mock data:", _data.length, "rows");
      }
      // Return state object yang bisa di-destructure
      return {
        data: _data,
        isRealData: _isRealData,
        sourceFile: _sourceFile,
        lastUpdated: _lastUpdated,
      };
    },

    // Get data array
    getData: function () {
      return _data;
    },

    // Get recent data
    getRecentData: function (days = 7) {
      return _data.slice(-days);
    },

    // Process raw CSV data (dipanggil dari Dashboard sebelum save)
    processCSVData: function (rawData) {
      console.log("Processing CSV data:", rawData.length, "raw rows");
      const processed = detectAndMapFields(rawData);
      return processed;
    },

    // Save data (dipanggil saat import CSV)
    saveData: function (newData, filename) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        localStorage.setItem(
          METADATA_KEY,
          JSON.stringify({
            lastUpdated: new Date().toISOString(),
            sourceFile: filename,
            rowCount: newData.length,
          }),
        );

        _data = newData;
        _isRealData = true;
        _sourceFile = filename;
        _lastUpdated = new Date();

        // Trigger event untuk halaman lain
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("sunflower-data-updated", {
              detail: {
                count: newData.length,
                source: filename,
                timestamp: _lastUpdated.toISOString(),
              },
            }),
          );
        }

        console.log("🌻 Data saved:", newData.length, "rows from", filename);
        return true;
      } catch (e) {
        console.error("Error saving data:", e);
        return false;
      }
    },

    // Check if using real data
    isRealData: function () {
      return _isRealData;
    },

    // Get source filename
    getSource: function () {
      return _sourceFile;
    },

    // Get last update time
    getLastUpdated: function () {
      return _lastUpdated;
    },

    // Reset to demo data
    resetToDemo: function () {
      _data = generateMockData();
      _isRealData = false;
      _sourceFile = "Data Demo";
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(METADATA_KEY);
      return _data;
    },

    // Get statistics
    getStats: function () {
      if (_data.length === 0) return null;

      const totalWater = _data.reduce((sum, d) => sum + d.water_use, 0);
      const avgKs =
        _data.reduce((sum, d) => sum + d.water_stress_coefficient, 0) /
        _data.length;

      return {
        totalRows: _data.length,
        totalWater: totalWater,
        avgKs: avgKs,
        dateRange:
          _data.length > 0
            ? {
                start: _data[0].date,
                end: _data[_data.length - 1].date,
              }
            : null,
      };
    },
  };

  // Expose ke global scope
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SunflowerData;
  } else {
    global.SunflowerData = SunflowerData;
  }
})(typeof window !== "undefined" ? window : this);
