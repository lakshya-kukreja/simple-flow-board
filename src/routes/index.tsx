import { createFileRoute } from "@tanstack/react-router";
import { Board } from "@/components/board/Board";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowBoard — Mini Kanban Task Board" },
      {
        name: "description",
        content:
          "FlowBoard is a clean mini Kanban board: organise tasks across Todo, In Progress and Done, with light, dark and disco themes.",
      },
      { property: "og:title", content: "FlowBoard — Mini Kanban Task Board" },
      {
        property: "og:description",
        content: "Organise tasks across Todo, In Progress and Done on a simple, fast Kanban board.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Board />;
}
