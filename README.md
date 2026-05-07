# Sunflower Balance

Sunflower Balance adalah proyek dashboard analisis irigasi untuk bunga matahari. Aplikasi web ini memvisualisasikan data air untuk mendukung keputusan irigasi presisi, memantau presipitasi, penggunaan air, defisit air tanah, koefisien stres air (Ks), dan tahapan pertumbuhan tanaman.

## Fitur Utama

- Dashboard utama dengan metrik ringkas untuk cakupan air dan kesehatan tanaman.
- Grafik interaktif untuk:
  - Penggunaan air seiring waktu
  - Perbandingan presipitasi dan irigasi
  - Koefisien stres air (Ks)
- Monitor kesehatan lahan dengan indikator keseimbangan air.
- Import data CSV untuk mengganti data demo dengan data nyata.
- Pilihan rentang tanggal: 7 hari, 30 hari, 90 hari, atau seluruh data.
- Halaman analisis tambahan untuk:
  - Input air
  - Respons tanaman
  - Analisis stres
  - Tahapan pertumbuhan
  - Wawasan ringkas
- Tampilan responsif dengan desain tema cerah dan mode gelap.

## Struktur Proyek

```text
shared-data.js

dashboard_overview/
  code.html
water_input_analysis/
  code.html
plant_response_analysis/
  code.html
stress_analysis/
  code.html
growth_stage_analysis/
  code.html
insights_summary/
  code.html
```

- `dashboard_overview/code.html` - Dashboard utama
- `shared-data.js` - Logika pemrosesan dan pemetaan data CSV
- `water_input_analysis/code.html` - Analisis input air
- `plant_response_analysis/code.html` - Analisis respons tanaman
- `stress_analysis/code.html` - Analisis stres air dan Ks
- `growth_stage_analysis/code.html` - Analisis tahapan pertumbuhan tanaman
- `insights_summary/code.html` - Ringkasan wawasan dan rekomendasi

## Format Data CSV

Aplikasi ini mendukung import file CSV dengan kolom berikut:

- `date` (contoh: `MM/DD/YYYY`)
- `precipitation`
- `irrigation`
- `water_use`
- `soil_water_deficit`
- `water_stress_coefficient`
- `growth_stage`

Contoh header:

```csv
date,precipitation,irrigation,water_use,soil_water_deficit,water_stress_coefficient,growth_stage
```

## Cara Menjalankan

1. Buka folder proyek di file explorer.
2. Buka file `dashboard_overview/code.html` di browser.

> Untuk hasil terbaik, gunakan server lokal sederhana jika browser menolak memuat file eksternal.

Contoh dengan Python:

```powershell
cd "c:\Users\user\Documents\Sunflower"
python -m http.server 8000
```

Kemudian buka `http://localhost:8000/dashboard_overview/code.html`.
