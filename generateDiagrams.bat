@echo off
for %%f in (*.puml) do (
  puml generate %%f -o %%f.png
)