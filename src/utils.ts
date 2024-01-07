import * as core from '@actions/core'
import {synthetics} from '@datadog/datadog-ci'


export const generateOutputs = ({
    results,
    summary,
    config,
  }: {
    results: synthetics.Result[]
    summary: synthetics.Summary,
    config: synthetics.RunTestsCommandConfig,
  }): void => {
    const baseUrl = synthetics.utils.getAppBaseURL(config)
    const batchUrl = synthetics.utils.getBatchUrl(baseUrl, summary.batchId)

    // Set outputs for other workflow steps to use
    core.setOutput('result', results.every(({ passed }) => passed))
    core.setOutput('url', batchUrl)
    core.setOutput('criticalErrors', summary.criticalErrors)
    core.setOutput('passed', summary.passed)
    core.setOutput('failedNonBlocking', summary.failedNonBlocking)
    core.setOutput('failed', summary.failed)
    core.setOutput('timedOut', summary.timedOut)
    core.setOutput('skipped', summary.skipped)
    core.setOutput('notFound', summary.testsNotFound.size)
    core.setOutput('testRuns', JSON.stringify(results.map(r => ({
        id: r.resultId,
        name: r.test.name,
        tags: r.test.tags,
        passed: r.passed,
        location: r.location,
    }))))
}
