const handleAnalyze = async () => {
    const aiData =
        await analyzeSubmission(submissionText);

    setAiResult(aiData);
};