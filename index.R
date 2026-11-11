# Floresta Web OS: webR audit/statistics runtime.
# JavaScript delivers event batches; R computes descriptive statistics.
floresta_audit <- function(events) {
  if (length(events) == 0L) return(list(count=0L, by_action=list(), mean_interval_ms=NA_real_, median_interval_ms=NA_real_))
  actions <- vapply(events, function(e) as.character(e$action), character(1))
  times <- vapply(events, function(e) as.numeric(e$timestamp), numeric(1))
  intervals <- diff(sort(times))
  list(count=length(actions), by_action=as.list(table(actions)),
       mean_interval_ms=if(length(intervals)) mean(intervals) else NA_real_,
       median_interval_ms=if(length(intervals)) median(intervals) else NA_real_)
}
