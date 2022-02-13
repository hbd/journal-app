const API_URL = "http://localhost:8085";

export const submitPrompt = (input) => {
  const submitInput = {
    prompt: input
  };
  console.debug(JSON.stringify(submitInput));
  console.debug(`submitting: '${input}'`);
  fetch(`${API_URL}/submit`, {
    method: "POST",
    body: JSON.stringify(submitInput),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then(
      (result) => {
        console.log("Submit response:", result);
        return result;
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        console.error(`Error submitting input: ${error}`);
      }
    )
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
};
