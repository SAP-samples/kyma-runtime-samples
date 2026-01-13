# Contributing to Kyma Runtime Extension Samples

You want to contribute to Kyma Runtime Extension Samples? Welcome! Please read this document to understand what you can do:

* [Help Others](#help-others)
* [Analyze Issues](#analyze-issues)
* [Report an Issue](#report-an-issue)
* [Contribute Code](#contribute-code)

## Help Others

You can help Kyma Runtime by helping others who use Kyma Runtime and need support. You will find them in the [SAP BTP, Kyma runtime Community](https://answers.sap.com/tags/73554900100800003012).

## Analyze Issues

Analyzing issue reports can be a lot of effort. Any help is welcome!
Go to [the Github issue tracker](https://github.com/SAP-samples/kyma-runtime-extension-samples/issues?q=is%3Aopen) and find an open issue which needs additional work or a bugfix.

Additional work may be further information, or a minimized jsbin example or gist, or it might be a hint that helps understanding the issue. Maybe you can even find and [contribute](#contribute-code) a bugfix?

## Report an Issue

If you find an issue with the sample, please open a Github Issue.

## Contribute Code

You are welcome to contribute code to Kyma Runtime Extension Samples in order to fix bugs in exisitng samples or to add new samples.

There are three important things to know:

1. You must be aware of the Apache License (which describes contributions) and **agree to the Developer Certificate of Origin**. This is common practice in all major Open Source projects. To make this process as simple as possible, we are using *[CLA assistant](https://cla-assistant.io/)*. CLA assistant is an open source tool that integrates with GitHub very well and enables a one-click-experience for accepting the DCO. See the respective section below for details.
2. Please follow coding style, convention and standards for the respctive technology in which sample is being implemented.
3. **Not all proposed contributions can be accepted**. Some samples / scenarios  may e.g. just fit a third-party add-on better or there is already a similiar sample.

### Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this project. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).  
This happens in an automated fashion during the submission process: the CLA assistant tool will add a comment to the pull request. Click it to check the DCO, then accept it on the following screen. CLA assistant will save this decision for upcoming contributions.

This DCO replaces the previously used CLA ("Contributor License Agreement") as well as the "Corporate Contributor License Agreement" with new terms which are well-known standards and hence easier to approve by legal departments. Contributors who had already accepted the CLA in the past may be asked once to accept the new DCO.

### How to contribute - the Process

1. Make sure the change would be welcome (e.g. a bugfix or a useful feature); best do so by proposing it in a GitHub issue
2. Create a branch forking the kyma-runtime-extension-samples repository and do your change
3. Commit and push your changes on that branch
   * When you have several commits, squash them into one (see [this explanation](http://davidwalsh.name/squash-commits-git)) - this also needs to be done when additional changes are required after the code review

4. In the commit message follow the [commit message guidelines](https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53).
5. If your change fixes an issue reported at GitHub, add the following line to the commit message:
   * ```Fixes https://github.com/SAP-samples/kyma-runtime-extension-samples/issues/(issueNumber)```
   * Do NOT add a colon after "Fixes" - this prevents automatic closing.
   * When your pull request number is known (e.g. because you enhance a pull request after a code review), you can also add the line ```Closes https://github.com/SAP-samples/kyma-runtime-extension-samples/pull/(pullRequestNumber)```
6. Create a Pull Request to github.com/SAP-samples/kyma-runtime-extension-samples
7. Follow the link posted by the CLA assistant to your pull request and accept the Developer Certificate of Origin, as described in detail above.
8. Wait for our code review and approval, possibly enhancing your change on request
9. Once the change has been approved we will inform you in a comment
10. We will close the pull request, feel free to delete the now obsolete branch.
