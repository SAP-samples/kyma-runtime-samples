# text-analysis

## Overview

This function provides an indication of the sentiment of the provided text.  

See [TextBlob](https://textblob.readthedocs.io/en/dev/quickstart.html#sentiment-analysis) sentiment analysis engine for more details.

It uses the `python39` function runtime .  

[handler.py](handler.py) - Javscript source code for the function

[requirements.txt](../sentiment-analysis/package.json) - Dependencies for the function

[k8s/function.yaml](k8s/function.yaml) - `Function` configuration for the function

## Usage

Post the content as json `text`:
```
{"text": "I hate this product. It is rubbish.  Throw it in the garbage." }
```

Returns 
```
{
    "polarity": -0.8,
    "subjectivity": 0.9
}
```

`polarity`: float between -1 and 1 indicating the degree of **negative** or **positive** sentiment.

`subjectivity`: float between 0 and 1 indicating the degree of **subjectivity** of the text.

## Deploy
The [k8s](k8s) directory contains the yaml file with the `Function` configuration. 

Apply the configuration as follows:


* Set up environment variables

  * OSX

    ```shell script
    export NS={your-namespace}
    ```

  * Windows PowerShell

    ```powershell
    $NS={your-namespace}
    ```


```
kubectl apply -n $NS -f k8s/function.yaml
```

## Verify

The API is available within the namespace in the Kyma cluster via the URL 

http://content-moderation

Send a POST request with the payload described above in **Usage**