appPath <- "/home/fermo/Bureau/Lab/Hypothesis_generation/experiments/E1"
dataPath <- "/home/fermo/Bureau/Lab/Hypothesis_generation/experiments/E1/Data"
filename <- "data"

bulkloader <- paste0(appPath, "/bulkloader.yaml")
rawfile <- paste0(dataPath, "/", filename, "_raw.csv")
tidyfile <- paste0(dataPath, "/", filename, "_tidy.csv")

download <- TRUE
if(download){
  shellCmd <- paste0(
  "appcfg.py download_data",
  "--config_file", bulkloader, " ",
  "--filename=", rawfile, " ",
  "--kind=DataObject ",
  appPath
  )
  system(command = shellCmd)
}