import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeimiAnalyzer.css';

const FeimiAnalyzer = () => {
  const [eventText, setEventText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = 'https://api.deepseek.com/v1/chat/completions';
  const API_KEY = 'sk-08fd0b2b32284162bad21e12b9f07c14';

  const valueRules = {
    'C1': { name: '绝对坦率', purpose: '建立坦诚高效的沟通文化', behaviors: ['主动发起争议对话', '高效化解分歧'] },
    'C2': { name: '信息透明', purpose: '实现关键信息无损传递', behaviors: ['信息无衰减传递', '风险即时上报'] },
    'C3': { name: '问题驱动', purpose: '建立系统性解决问题能力', behaviors: ['快速响应', '根治问题'] },
    'C4': { name: '言行一致', purpose: '打造可信赖的组织承诺', behaviors: ['承诺匹配进度', '表述一致'] },
    'C5': { name: '事实导向', purpose: '实现数据驱动的科学决策', behaviors: ['数据决策', '可测量结果'] },
    'C6': { name: '信息共享', purpose: '最大化知识资产价值', behaviors: ['知识沉淀', '信息保鲜'] },
    'C7': { name: '知识复用', purpose: '提升经验迁移效率', behaviors: ['经验适配', '高效转化'] },
    'C8': { name: '成长透明', purpose: '加速个人与组织进化', behaviors: ['需求可见', '互助响应'] },
    'C9': { name: '团队共赢', purpose: '构建协同增效的生态系统', behaviors: ['价值创造', '体验优化'] },
    'C10': { name: '跨团队创新', purpose: '激发跨界创新价值', behaviors: ['边界突破', '资源杠杆'] },
    'C11': { name: '目标韧性', purpose: '锻造抗压适应能力', behaviors: ['抗压执行', '动态适应'] },
    'C12': { name: '超预期交付', purpose: '创造持续价值溢出', behaviors: ['价值增值', '峰值体验'] },
    'C13': { name: '理性拒绝', purpose: '聚焦战略价值区', behaviors: ['战略定力', '提供替代方案'] },
    'C14': { name: '创新回报', purpose: '实现风险调整收益', behaviors: ['风险对冲', '失败转化'] },
    'C15': { name: '突破性尝试', purpose: '推动可控边界突破', behaviors: ['可控冒险', '极限学习'] },
    'C16': { name: '多维尊重', purpose: '建立深度互信生态', behaviors: ['文化共识', '角色体验'] },
    'C17': { name: '包容进化', purpose: '打造多样性创新土壤', behaviors: ['多元决策', '心理安全'] },
    'C18': { name: '谦逊成长', purpose: '加速短板转化', behaviors: ['缺口披露', '知识辐射'] },
    'C19': { name: '智慧沟通', purpose: '提升沟通转化效率', behaviors: ['信息增值', '情绪生产'] },
    'C20': { name: '冲突价值', purpose: '将冲突转化为升级动能', behaviors: ['矛盾转化', '文化免疫'] }
  };

  const parseMarkdown = (text) => {
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Italic text
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    // Format category tags for value rules
    html = html.replace(/(坦率真诚|开放协作|承诺敢为|尊重谦逊)\s+-\s+(C\d+\s+[^\n<]+)/gim, 
      '<span class="category-tag $1">$1</span> - $2');
    
    // Wrap case content
    html = html.replace(/(\*\*对应行为案例：\*\*<br>)(.*?)(?=<br><br>|$)/gims, '$1<div class="case-content">$2</div>');
    
    return html;
  };

  const typeWriter = async (text) => {
    return new Promise((resolve) => {
      let i = 0;
      let currentContent = '';
      const speed = 30;
      
      const type = () => {
        if (i < text.length) {
          currentContent += text.charAt(i);
          setResult(parseMarkdown(currentContent));
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };
      type();
    });
  };

  const analyzeEvent = async () => {
    if (!eventText.trim()) {
      setError('请输入事件文本');
      return;
    }

    setLoading(true);
    setError('');
    setResult('<span class="typing-cursor">|</span>');

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `你是一个价值观匹配专家。根据提供的事件文本，从以下20个价值观准则中选择最匹配的1-2个，并生成对应的行为案例。

价值观准则信息和大分类：

**坦率真诚（C1-C5）：**
C1-绝对坦率：主动发起争议对话、高效化解分歧
C2-信息透明：信息无衰减传递、风险即时上报  
C3-问题驱动：快速响应、根治问题
C4-言行一致：承诺匹配进度、表述一致
C5-事实导向：数据决策、可测量结果

**开放协作（C6-C10）：**
C6-信息共享：知识沉淀、信息保鲜
C7-知识复用：经验适配、高效转化
C8-成长透明：需求可见、互助响应
C9-团队共赢：价值创造、体验优化
C10-跨团队创新：边界突破、资源杠杆

**承诺敢为（C11-C15）：**
C11-目标韧性：抗压执行、动态适应
C12-超预期交付：价值增值、峰值体验
C13-理性拒绝：战略定力、提供替代方案
C14-创新回报：风险对冲、失败转化
C15-突破性尝试：可控冒险、极限学习

**尊重谦逊（C16-C20）：**
C16-多维尊重：文化共识、角色体验
C17-包容进化：多元决策、心理安全
C18-谦逊成长：缺口披露、知识辐射
C19-智慧沟通：信息增值、情绪生产
C20-冲突价值：矛盾转化、文化免疫

重要要求：
1. 请基于事件文本中的具体行为和结果来分析，不要基于请求或需求本身
2. 行为案例必须详细描述具体发生的行为过程和产生的积极影响
3. 案例长度控制在50-80字，要体现行为的完整闭环
4. 重点关注被认可人员的具体行动和贡献
5. 语言风格要求：使用自然但不失专业的表述，避免过于正式的商业化用词
   - 用"帮助"而不是"协助"或"帮忙"
   - 用"完成了"而不是"搞定了"
   - 用"快速"而不是"迅速"
   - 用"理清了"而不是"明确了"
   - 可以使用"然后"、"接着"等自然连接词
   - 避免"立即"、"迅速"、"高效"等过于正式的词汇

行为案例示例参考：
- 好的表述："小王接到需求后，快速帮助我们理清了整个流程，然后还制作了文档分享给团队，很有帮助"
- 避免的表述："王某收到需求后，迅速协助团队明确了流程规范，并制作了详细文档供团队成员参考"

请严格按照以下简洁格式输出：

**对应准则编号**
[大分类] - C[数字] [准则名称]
（如果匹配多个准则，可以列出多个，如：开放协作 - C8 成长透明、开放协作 - C9 团队共赢）

**对应行为案例：**
[详细描述具体发生的行为过程，包括采取的行动、方法、过程和产生的积极结果，50-80字，用研发人员日常口语化表述]`
            },
            {
              role: 'user',
              content: `请分析以下事件文本，匹配最符合的价值观准则：\n\n${eventText}`
            }
          ],
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      setResult('');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                await typeWriter(delta);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      setLoading(false);

    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setError('分析过程中出现错误，请检查网络连接或API配置');
    }
  };

  const copyResult = async () => {
    if (!result.trim()) {
      setError('没有可复制的内容');
      return;
    }

    try {
      // 处理结果内容，转换为纯文本格式
      let copyText = result
        // 去除HTML标签
        .replace(/<[^>]*>/g, '')
        // 去除大分类标签，只保留准则编号和名称
        .replace(/(坦率真诚|开放协作|承诺敢为|尊重谦逊)\s*-\s*(C\d+\s+[^\n]+)/g, '$2')
        // 清理多余的空行
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

      await navigator.clipboard.writeText(copyText);
      alert('复制成功！');
    } catch (err) {
      console.error('复制失败:', err);
      setError('复制失败，请手动选择内容复制');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      analyzeEvent();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>飞米积分价值观分析器</h1>
        <p>基于事件文本智能匹配价值观准则，生成行为案例和推荐理由</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回工具箱
        </button>
      </div>
      
      <div className="main-content">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="eventText" className="form-label">请输入事件文本：</label>
            <textarea 
              id="eventText" 
              className="form-textarea" 
              placeholder="请详细描述发生的事件，包括时间、地点、人物、具体行为等信息，系统将基于这些信息分析最符合的价值观准则..."
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button 
            className="analyze-btn" 
            onClick={analyzeEvent}
            disabled={loading}
          >
            {loading ? '分析中...' : '分析价值观匹配'}
          </button>
        </div>
        
        <div className="result-section">
          <div className="result-header">
            <h3 className="result-title">分析结果</h3>
            {loading && <div className="loading-spinner"></div>}
          </div>
          {result && (
            <button className="copy-btn" onClick={copyResult}>
              📋 复制结果
            </button>
          )}
          <div className="result-content">
            {error && (
              <div className="error-message">
                <strong>错误：</strong> {error}
              </div>
            )}
            {!result && !error && (
              <div className="result-empty">
                请输入事件文本并点击分析按钮，系统将为您匹配最适合的价值观准则
              </div>
            )}
            {result && (
              <div dangerouslySetInnerHTML={{ __html: result }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeimiAnalyzer;