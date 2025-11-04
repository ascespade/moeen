// ... existing code until line 1132 ...
  );
}

export default function ChatbotPage() {
  const pageConfig = ADMIN_PAGES.chatbot;
  return (
    <AdminPageWrapper
      requiredPermissions={pageConfig.requiredPermissions}
      pageTitle={pageConfig.title}
    >
      <ChatbotPageContent />
    </AdminPageWrapper>
  );
}
export default function ChatbotPage() {
  const pageConfig = ADMIN_PAGES.chatbot;
  return (
    <AdminPageWrapper
      requiredPermissions={pageConfig.requiredPermissions}
      pageTitle={pageConfig.title}
    >
      <ChatbotPageContent />
    </AdminPageWrapper>
  );
}
