const fs = require('fs');
const path = require('path');

// 读取文件路径
const constPath = path.join(__dirname, 'exportMonthConst.js');
const dataPath = path.join(__dirname, 'sheetdata.json');

// 读取exportMonthConst.js中的title值
function getTitleFromConst() {
    try {
        const constContent = fs.readFileSync(constPath, 'utf8');
        // 使用正则表达式提取title值
        const titleMatch = constContent.match(/title:\s*['"]([^'"]+)['"]/);
        if (titleMatch && titleMatch[1]) {
            return titleMatch[1];
        }
        throw new Error('未找到title值');
    } catch (error) {
        console.error('读取exportMonthConst.js失败:', error.message);
        throw error;
    }
}

// 读取sheetdata.json中的数据
function readSheetData() {
    try {
        const dataContent = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(dataContent);
    } catch (error) {
        console.error('读取sheetdata.json失败:', error.message);
        throw error;
    }
}

// 整理数据的主要函数
function buildData() {
    try {
        // 获取标题前缀
        const titlePrefix = getTitleFromConst();
        console.log('标题前缀:', titlePrefix);
        
        // 读取原始数据
        const sheetData = readSheetData();
        console.log('原始数据长度:', sheetData.length);
        
        // 存储整理后的数据
        const organizedData = [];
        
        // 遍历原始数据，识别数据块
        let i = 0;
        while (i < sheetData.length) {
            // 跳过null值
            if (sheetData[i] === null) {
                i++;
                continue;
            }
            
            // 检查是否是新数据块的开始（包含标题行）
            if (Array.isArray(sheetData[i]) && sheetData[i].some(item => 
                typeof item === 'string' && item.startsWith(titlePrefix))
            ) {
                console.log(`\n找到新数据块，开始索引: ${i}`);
                
                // 提取标题行
                const titleRow = sheetData[i];
                // 提取第一个非null的标题作为数据块标识
                const blockTitle = titleRow.find(item => 
                    typeof item === 'string' && item.startsWith(titlePrefix));
                console.log('数据块标题:', blockTitle);
                
                // 提取属性名行（下一行）
                if (i + 1 < sheetData.length && Array.isArray(sheetData[i + 1])) {
                    const headers = sheetData[i + 1];
                    console.log('属性名:', headers.filter(h => h !== null));
                    
                    // 提取数据行（从属性名行的下一行开始）
                    const dataRows = [];
                    let j = i + 2;
                    
                    // 识别所有月份列的索引（支持"X月"和"X月成交金额"格式）
                    const monthColumns = headers.map((header, index) => {
                        if (typeof header === 'string' && header.match(/^\d+月(成交金额)?$/)) {
                            return index;
                        }
                        return null;
                    }).filter(index => index !== null);
                    
                    // 识别种草金额列的索引（找到第二个种草金额列，通常是索引9）
                    const zhongcaoJinEIndices = headers.map((header, index) => {
                        if (typeof header === 'string' && header === '种草金额') {
                            return index;
                        }
                        return null;
                    }).filter(index => index !== null);
                    const zhongcaoJinEIndex = zhongcaoJinEIndices.length > 1 ? zhongcaoJinEIndices[1] : -1;
                    
                    // 继续读取直到遇到两个连续的null值或数组结束
                    while (j < sheetData.length) {
                        // 检查是否到达数据块结束（两个连续的null值）
                        if (sheetData[j] === null && j + 1 < sheetData.length && sheetData[j + 1] === null) {
                            break;
                        }
                        
                        // 如果是数组，添加到数据行
                        if (Array.isArray(sheetData[j])) {
                            const row = [...sheetData[j]];
                            
                            // 计算种草金额（所有月份成交金额的总和）
                            if (monthColumns.length > 0 && zhongcaoJinEIndex !== -1) {
                                let zhongcaoJinE = 0;
                                
                                // 遍历所有月份列，累加非null的成交金额
                                monthColumns.forEach(colIndex => {
                                    const value = row[colIndex];
                                    if (value !== null && !isNaN(value)) {
                                        zhongcaoJinE += Number(value);
                                    } else if (value && typeof value === 'object' && 'result' in value) {
                                        // 处理带有result属性的对象
                                        if (!isNaN(value.result)) {
                                            zhongcaoJinE += Number(value.result);
                                        }
                                    }
                                });
                                
                                // 更新种草金额字段
                                row[zhongcaoJinEIndex] = zhongcaoJinE;
                            }
                            
                            dataRows.push(row);
                        }
                        
                        j++;
                    }
                    
                    console.log('数据行数:', dataRows.length);
                    
                    // 将整理好的数据块添加到结果中
                    organizedData.push({
                        title: blockTitle,
                        headers: headers,
                        data: dataRows
                    });
                    
                    // 移动到下一个可能的数据块开始位置
                    i = j;
                } else {
                    // 如果没有属性名行，跳过
                    i++;
                }
            } else {
                // 不是数据块开始，继续下一行
                i++;
            }
        }
        
        // 为每个活动数据块添加货号统计信息
        organizedData.forEach(dataBlock => {
            // 查找货号列和种草金额列的索引
            const headers = dataBlock.headers;
            const productIdIndex = headers.findIndex(header => header === '货号');
            const zhongcaoJinEIndex = headers.findIndex(header => header === '种草金额');
            
            // 如果找到这两列，则进行统计
            if (productIdIndex !== -1 && zhongcaoJinEIndex !== -1) {
                // 统计每个货号的种草金额
                const productStats = {};
                
                dataBlock.data.forEach(row => {
                    const productId = row[productIdIndex];
                    const zhongcaoJinE = row[zhongcaoJinEIndex];
                    const daRenNiCheng = row[8]; // 达人昵称在索引8
                    
                    // 确保货号和种草金额都存在
                    if (productId && zhongcaoJinE !== null && !isNaN(zhongcaoJinE)) {
                        // 如果货号不存在，初始化统计信息
                        if (!productStats[productId]) {
                            productStats[productId] = {
                                totalZhongcaoJinE: 0,
                               daRenLieBiao: [],
                               zongDaRenShuLiang: 0
                            };
                        }
                        
                        // 累加种草金额
                        productStats[productId].totalZhongcaoJinE += Number(zhongcaoJinE);
                        
                        // 添加达人到列表（去重）
                        const daRenName = daRenNiCheng && typeof daRenNiCheng === 'object' && daRenNiCheng.richText && Array.isArray(daRenNiCheng.richText)
                            ? daRenNiCheng.richText.map(rt => rt && rt.text ? rt.text : '').join('') 
                            : daRenNiCheng || '';
                        
                        if (daRenName && !productStats[productId].daRenLieBiao.includes(daRenName)) {
                            productStats[productId].daRenLieBiao.push(daRenName);
                            productStats[productId].zongDaRenShuLiang = productStats[productId].daRenLieBiao.length;
                        }
                    }
                });
                
                // 添加统计信息到数据块
                dataBlock.productStats = productStats;
                console.log(`\n活动 "${dataBlock.title}" 货号统计：`);
                console.log(`共统计 ${Object.keys(productStats).length} 个货号`);
                Object.entries(productStats).forEach(([productId, stats]) => {
                    console.log(`货号 ${productId}: 总种草金额 ${stats.totalZhongcaoJinE.toFixed(2)}，达人数量 ${stats.zongDaRenShuLiang}`);
                });
            }
        });
        
        console.log(`\n整理完成，共找到 ${organizedData.length} 个数据块`);
        
        // 保存整理后的数据到文件
        const outputPath = path.join(__dirname, 'organizedData.json');
        fs.writeFileSync(outputPath, JSON.stringify(organizedData, null, 2), 'utf8');
        console.log(`整理后的数据已保存到: ${outputPath}`);
        
        return organizedData;
    } catch (error) {
        console.error('整理数据失败:', error.message);
        throw error;
    }
}

// 执行整理函数
if (require.main === module) {
    buildData();
}

// 导出函数供其他模块使用
module.exports = { buildData };