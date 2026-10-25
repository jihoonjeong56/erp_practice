package com.example.erp.domain.employee;

import com.example.erp.domain.employee.dto.EmployeeSearchCondition;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

import static com.example.erp.domain.department.QDepartment.department;
import static com.example.erp.domain.employee.QEmployee.employee;
import static com.example.erp.domain.position.QPosition.position;

@Repository
@RequiredArgsConstructor
public class EmployeeQueryRepository {

    private final JPAQueryFactory queryFactory;

    public Page<Employee> search(EmployeeSearchCondition cond, Pageable pageable) {
        // 1) 내용 조회: 부서/직급을 fetch join으로 한 번에 가져와 N+1 방지
        List<Employee> content = queryFactory
                .selectFrom(employee)
                .join(employee.department, department).fetchJoin()
                .join(employee.position, position).fetchJoin()
                .where(conditions(cond))
                .orderBy(employee.empNo.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 2) 전체 건수 조회: 조인 없이 count만
        JPAQuery<Long> countQuery = queryFactory
                .select(employee.count())
                .from(employee)
                .where(conditions(cond));

        // 첫 페이지인데 건수가 페이지 크기보다 적으면 count 쿼리를 생략한다
        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    private BooleanExpression[] conditions(EmployeeSearchCondition cond) {
        return new BooleanExpression[]{
                keywordContains(cond.keyword()),
                deptEq(cond.deptId()),
                positionEq(cond.positionId()),
                statusEq(cond.status())
        };
    }

    // 조건이 없으면 null을 반환 → QueryDSL이 where에서 무시한다
    private BooleanExpression keywordContains(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return null;
        }
        String kw = keyword.trim();
        return employee.empName.containsIgnoreCase(kw)
                .or(employee.empNo.containsIgnoreCase(kw));
    }

    private BooleanExpression deptEq(Long deptId) {
        return deptId != null ? employee.department.id.eq(deptId) : null;
    }

    private BooleanExpression positionEq(Long positionId) {
        return positionId != null ? employee.position.id.eq(positionId) : null;
    }

    private BooleanExpression statusEq(String status) {
        return StringUtils.hasText(status) ? employee.status.eq(status) : null;
    }
}