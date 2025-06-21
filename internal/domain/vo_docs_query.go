package domain

type DocsQuery struct {
	page         Page
	limit        Limit
	sortBy       SortBy
	sortOrder    SortOrder
	tags         Tags
	createdRange DateRange
	updatedRange DateRange
}

func NewDocsQuery(
	page Page,
	limit Limit,
	sortBy SortBy,
	sortOrder SortOrder,
	tags Tags,
	createdRange DateRange,
	updatedRange DateRange,
) DocsQuery {
	return DocsQuery{
		page:         page,
		limit:        limit,
		sortBy:       sortBy,
		sortOrder:    sortOrder,
		tags:         tags,
		createdRange: createdRange,
		updatedRange: updatedRange,
	}
}

func DefaultDocsQuery() DocsQuery {
	return DocsQuery{
		page:         DefaultPage(),
		limit:        DefaultLimit(),
		sortBy:       DefaultSortBy(),
		sortOrder:    DefaultSortOrder(),
		tags:         Tags{},
		createdRange: DateRange{},
		updatedRange: DateRange{},
	}
}

func (q DocsQuery) Page() Page               { return q.page }
func (q DocsQuery) Limit() Limit             { return q.limit }
func (q DocsQuery) SortBy() SortBy           { return q.sortBy }
func (q DocsQuery) SortOrder() SortOrder     { return q.sortOrder }
func (q DocsQuery) Tags() Tags               { return q.tags }
func (q DocsQuery) CreatedRange() DateRange  { return q.createdRange }
func (q DocsQuery) UpdatedRange() DateRange  { return q.updatedRange }

func (q DocsQuery) Offset() int {
	return (q.page.Value() - 1) * q.limit.Value()
}