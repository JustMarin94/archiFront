import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";

export default function AuthorGraph({ work }) {
  const navigate = useNavigate();
  const authors = work?.authors ?? [];

  const nodes = [
    {
      id: "work",
      type: "workNode", // custom type to distinguish from author nodes
      position: { x: 250, y: 50 },
      data: {
        label: (
          <img
            src={work?.photos?.[0]?.url ?? "/default-book.png"}
            alt={work?.title}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              cursor: "pointer",
            }}
          />
        ),
      },
      style: { background: "transparent", border: "none", padding: 0 },
    },

    ...authors.map((author, index) => ({
      id: String(author.id),
      type: "authorNode",
      position: { x: index * 150 + 100, y: 250 },
      data: {
        label: (
          <img
            src={author.image ?? "/default-author.png"}
            alt={author.name}
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              cursor: "pointer",
            }}
          />
        ),
      },
      style: { background: "transparent", border: "none", padding: 0 },
    })),
  ];

  const edges = authors.map((author) => ({
    id: String(author.id),
    type: author.type === "group" ? "groupNode" : "authorNode",
    source: "work",
    target: String(author.id),
    style: { stroke: "#999", strokeWidth: 2 },
  }));

  const handleNodeClick = (event, node) => {
    if (node.id === "work") {
      navigate(`/works/${work.id}`);
    } else {
      const author = authors.find((a) => String(a.id) === node.id);

      if (author.type === "group") {
        navigate(`/author-groups/${node.id}`);
      } else {
        navigate(`/authors/${node.id}`);
      }
    }
  };

  return (
    <div style={{ height: 500, width: "100%" }} className="author-graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      ></ReactFlow>
    </div>
  );
}
