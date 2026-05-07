# Sunflower Balance

Sunflower Balance adalah dashboard analisis irigasi untuk bunga matahari. Aplikasi web ini membantu memantau keseimbangan air tanaman melalui visualisasi data presipitasi, irigasi, penggunaan air, defisit air tanah, dan koefisien stres air (Ks). Data dapat diimpor dari file CSV sehingga mudah digunakan untuk analisis lapangan.

## Fitur

- Dashboard interaktif dengan metrik utama
- Grafik tren penggunaan air dan sumber kelembaban
- Analisis stres air menggunakan indeks Ks
- Ringkasan kondisi lahan dan rekomendasi irigasi
- Import CSV untuk data aktual
- Filter rentang tanggal (7, 30, 90 hari atau semua data)
- Mode gelap dan notifikasi

## Dataset yang Diperlukan

Format CSV yang didukung:
- `date`
- `precipitation`
- `irrigation`
- `water_use`
- `soil_water_deficit`
- `water_stress_coefficient`
- `growth_stage`

## Struktur Proyek

- `dashboard_overview/code.html` — Dashboard utama
- `water_input_analysis/code.html` — Analisis input air
- `plant_response_analysis/code.html` — Respons tanaman
- `stress_analysis/code.html` — Analisis stres
- `growth_stage_analysis/code.html` — Tahap pertumbuhan
- `insights_summary/code.html` — Wawasan ringkas
- `shared-data.js` — Logika pemrosesan CSV dan data bersama
