self.addEventListener("push", (event) => {
  const payload = event.data?.json?.() ?? {
    title: "Update",
    body: "New activity is available.",
  };

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Update", {
      body: payload.body,
      data: payload.data,
      icon: "/icon.svg",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => client.url.endsWith(targetUrl));

      if (existingClient) {
        return existingClient.focus();
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});
