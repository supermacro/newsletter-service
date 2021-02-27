Some context:

https://github.com/mjmlio/mjml/issues/42

### Running Emails

Compile markdown content in "watch mode":

```
> echo "./content/january.md"| entr ./compile.sh
```

And serve the `index.html` file 


```
> cd dist
> python -m http.server
```


