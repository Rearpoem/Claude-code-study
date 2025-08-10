import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ToolBox.css';

const ToolBox = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTools();
  }, []);

  useEffect(() => {
    filterTools();
  }, [currentCategory, searchTerm, tools]);

  const loadTools = async () => {
    try {
      // 模拟加载工具数据
      const toolsData = [
        {
          name: "飞米积分价值观分析器",
          description: "基于事件文本智能匹配价值观准则，生成行为案例和推荐理由",
          category: "人力资源",
          tags: ["价值观", "积分", "分析", "AI"],
          icon: "🎯",
          version: "1.0.0",
          author: "Claude Code",
          route: "/feimi-analyzer"
        }
      ];
      
      setTools(toolsData);
      setLoading(false);
    } catch (error) {
      console.error('加载工具失败:', error);
      setLoading(false);
    }
  };

  const filterTools = () => {
    const filtered = tools.filter(tool => {
      const matchesCategory = currentCategory === 'all' || tool.category === currentCategory;
      const matchesSearch = !searchTerm || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
    
    setFilteredTools(filtered);
  };

  const openTool = (route) => {
    navigate(route);
  };

  const categories = ['all', ...new Set(tools.map(tool => tool.category))];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        正在扫描工具目录...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🛠️ 开发工具箱</h1>
        <p>集成开发过程中常用的小工具，提升工作效率</p>
        <div className="stats">
          <span>共 {tools.length} 个工具可用</span>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <input 
            type="text" 
            className="search-input" 
            placeholder="搜索工具名称、描述或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-tabs">
          {categories.map(category => (
            <div 
              key={category}
              className={`filter-tab ${currentCategory === category ? 'active' : ''}`}
              onClick={() => setCurrentCategory(category)}
            >
              {category === 'all' ? '全部' : category}
            </div>
          ))}
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>没有找到匹配的工具</h3>
          <p>尝试调整搜索条件或选择其他分类</p>
        </div>
      ) : (
        <div className="tools-grid">
          {filteredTools.map((tool, index) => (
            <div 
              key={index}
              className="tool-card" 
              onClick={() => openTool(tool.route)}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-title">{tool.name}</div>
              <div className="tool-description">{tool.description}</div>
              <div className="tool-meta">
                <span className="tool-category">{tool.category}</span>
                <div className="tool-tags">
                  {tool.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tool-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolBox;