import scipy.stats as stats
import scipy.signal as signal
import numpy as np

def xcorr(x,y,maxLag,totalDays):
  """
  Perform Cross-Correlation on x and y
  x    : 1st signal
  y    : 2nd signal
  maxLag : Lag limit (range -maxLag < 0 < +maxLag)
  totalDays : Total days selected (to range the coefficient between 0 and 1)

  returns
  lags : lags of correlation
  corr : coefficients of correlation
  """
  corr = signal.correlate(x, y, mode="full")
  lags = signal.correlation_lags(len(x), len(y), mode="full")
  zeroIndex = list(lags).index(0)
  corr = corr[zeroIndex - maxLag:zeroIndex + maxLag +1]
  lags = lags[zeroIndex - maxLag:zeroIndex + maxLag + 1]
  cFixed = []
  for c in corr:
    if np.isnan(c):
      cFixed.append("")
    else:
      cFixed.append(c/totalDays)


  return lags, cFixed
