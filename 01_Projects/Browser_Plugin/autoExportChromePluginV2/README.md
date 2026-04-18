## exceljs的API
### 1.sheet
    获取sheet：
        1.遍历
        workbook.worksheets.forEach((sheet, index) => {
        })
        2. 按 name 提取工作表
        const worksheet = workbook.getWorksheet('My Sheet');

        3.  按 id 提取工作表
        const worksheet = workbook.getWorksheet(1);
    获取sheet数据：
        sheet.getSheetValues()
### 2.行
    row = sheet.getRow(rowNumber)
### 3.单元格
    cell = row.getCell(colNumber)
    修改：cell.value = 5
741



