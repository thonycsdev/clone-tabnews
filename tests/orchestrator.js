import retry from "async-retry";
async function waitForAllServices() {
  await waitForWebServer();
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
    onRetry: retryErroLogMessage,
  });
}

async function fetchStatusPage() {
  const response = await fetch("http://localhost:3000/api/v1/status");
  if (!response.ok) {
    throw new Error(`Fail to fetch status ${response.status}`);
  }
}

async function retryErroLogMessage(err, attempt) {
  console.error(`Error on attempt: ${attempt}. ${err.message}`);
}

export default { waitForAllServices };
