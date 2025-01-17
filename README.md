# HorariApp
- Los que hacen la interfaz subid todo lo que hagais a la rama de **interface** no a main.
- Los que hacen el back end subid los cambios a la rama de **dev**.

# Descargar los datos de una rama a local (en una carpeta vacia)
- git init .
- git pull https://github.com/tfHugo14/HorariApp.git NOMBRE_DE_LA_RAMA

# Subir cambios a github
## renombrar rama para que no de problemas (por defecto al hacer el pull la rama se llama main)
- git branch -M NOMBRE_DE_LA_RAMA
## añadir url al la que subir los cambios con el alias de "origin"
- git remote add origin https://github.com/tfHugo14/HorariApp.git
## pushear cambios a la rama (aseguraos de tener los datos mas recientes de la rama antes de pushear para no pisar los cambios de nadie)
- git push -u origin NOMBRE_DE_LA_RAMA
