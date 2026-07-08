import openpyxl
import math

x_pi = 3.14159265358979324 * 3000.0 / 180.0

def bd09_to_gcj02(bd_lon, bd_lat):
    x = bd_lon - 0.0065
    y = bd_lat - 0.006
    z = math.sqrt(x * x + y * y) - 0.00002 * math.sin(y * x_pi)
    theta = math.atan2(y, x) - 0.000003 * math.cos(x * x_pi)
    gg_lon = z * math.cos(theta)
    gg_lat = z * math.sin(theta)
    return gg_lon, gg_lat

wb = openpyxl.load_workbook(r'C:\Users\14183\Desktop\工作簿1.xlsx')
ws = wb.active

with open('markers_excel.txt', 'w', encoding='utf-8') as f:
    row_idx = 1
    for row in ws.iter_rows(min_row=2, values_only=True):
        coord = row[2]
        name = row[5]
        if not coord or not name:
            continue
        lon, lat = map(float, str(coord).split(','))
        glon, glat = bd09_to_gcj02(lon, lat)
        f.write(f'  {{ id: {row_idx}, latitude: {glat:.6f}, longitude: {glon:.6f}, title: "{name}", iconPath: "/static/index.png", width: 24, height: 24, callout: {{ content: "{name}", color: "#000000", fontSize: 12, borderRadius: 4, bgColor: "#ffffff", padding: 4, display: "ALWAYS", textAlign: "center" }} }},\n')
        row_idx += 1

print(f'done, {row_idx - 1} markers')
